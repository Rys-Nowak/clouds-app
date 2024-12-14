import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Prediction } from '../../prediction';

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

  constructor(private apiService: ApiService) { }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push(e.target.result);
        };
        reader.readAsDataURL(file as File);
      });
    }
  }

  async submitImages(): Promise<void> {
    try {
      const apiCalls = this.uploadedImages.map(image => this.apiService.predict(image));
      this.predictions = await Promise.all(apiCalls);
      this.predictionResult.emit(this.predictions);
      console.log('Prediction Results:', this.predictions);
    } catch (error) {
      console.error('Error submitting images:', error);
    }
  }

  removeImage(image: string): void {
    const index = this.uploadedImages.indexOf(image);
    if (index > -1) {
      this.uploadedImages.splice(index, 1);
    }
  }
}