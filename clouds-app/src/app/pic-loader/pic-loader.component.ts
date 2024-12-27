import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Prediction } from '../../prediction';
import Cropper from 'cropperjs';

import 'cropperjs/dist/cropper.css';


@Component({
  selector: 'app-pic-loader',
  standalone: false,

  templateUrl: './pic-loader.component.html',
  styleUrl: './pic-loader.component.css'
})
export class PicLoaderComponent {
  uploadedImages: string[] = [];
  predictions: Prediction[] = []
  @Output() predictionResult = new EventEmitter<Prediction[]>();
  loading: boolean = false;
  cropper: Cropper | null = null;
  selectedImage: string | null = null;

  @ViewChild('cropperModal') cropperModal!: ElementRef;
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  constructor(private apiService: ApiService) { }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result;
          this.showCropper();
        };
        reader.readAsDataURL(file as File);
      });
    }
  }

  showCropper(): void {
    const modal = this.cropperModal.nativeElement;
    modal.style.display = 'flex';
    setTimeout(() => {
      if (this.imageElement) {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          responsive: true,
          background: false,
          zoomable: true,
        });
      }
    }, 0);
  }

  cropAndSave(): void {
    if (this.cropper) {
      const croppedCanvas = this.cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL('image/jpeg');
      this.uploadedImages.push(croppedImage);
      this.closeCropper();
    }
  }

  closeCropper(): void {
    const modal = this.cropperModal.nativeElement;
    modal.style.display = 'none';
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
    this.selectedImage = null;
  }

  async submitImages(): Promise<void> {
    this.loading = true;
    try {
      const apiCalls = this.uploadedImages.map(image => this.apiService.predict(image));
      this.predictions = await Promise.all(apiCalls);
      this.predictionResult.emit(this.predictions);
      console.log('Prediction Results:', this.predictions);
    } catch (error) {
      console.error('Error submitting images:', error);
    } finally {
      this.loading = false;
    }
  }

  removeImage(image: string): void {
    const index = this.uploadedImages.indexOf(image);
    if (index > -1) {
      this.uploadedImages.splice(index, 1);
    }
  }
}