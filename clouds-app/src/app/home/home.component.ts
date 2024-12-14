import { Component } from '@angular/core';
import { Prediction } from '../../prediction';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  predictions: Prediction[] = [];
  avgPredValues: { [key: string]: number } = {};
  bestLabel: string = "";
  chartLabels: string[] = [];
  chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };
  chartDataset = {
    data: {},
  };
  labelToName = new Map(
    Object.entries({
      Ac: "Altocumulus",
      Cc: "Cirrocumulus",
      Sc: "Stratocumulus",
      Cu: "Cumulus",
      St: "Stratus",
      As: "Altostratus",
      Cs: "Cirrostratus",
      Ns: "Nimbostratus",
      Cb: "Cumulonimbus",
      Ci: "Cirrus",
      Ct: "Contrail",
    })
  )

  constructor() { }

  handlePredictionResult(pred: Prediction[]): void {
    this.predictions = pred;
    this.calculateAverages();
  }

  calculateAverages(): void {
    const sums: { [key: string]: number } = {};
    const counts: { [key: string]: number } = {};
    this.predictions.forEach(pred => {
      for (const [key, value] of Object.entries(pred)) {
        if (!sums[key]) {
          sums[key] = 0;
          counts[key] = 0;
        }
        sums[key] += value as number;
        counts[key]++;
      }
    });

    this.avgPredValues = {};
    for (const key in sums) {
      this.avgPredValues[key] = sums[key] / counts[key];
    }

    this.chartLabels = Object.keys(this.avgPredValues);
    this.chartDataset.data = this.avgPredValues;
    this.bestLabel = Object.keys(this.avgPredValues).reduce((a, b) => this.avgPredValues[a] > this.avgPredValues[b] ? a : b);
  }
}
