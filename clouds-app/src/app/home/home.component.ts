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
  labelToName = {
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
    Ct: "Contrails or Clear Sky",
  };
  labelToNameMap = new Map(Object.entries(this.labelToName));

  constructor() { }

  handlePredictionResult(preds: Prediction[]): void {
    this.predictions = preds;
    this.calculateAverages();
  }

  calculateAverages(): void {
    const sums: Map<string, number> = new Map();
    this.predictions.forEach(pred => {
      for (const [key, value] of Object.entries(pred)) {
        sums.set(key, +(sums.get(key) ?? "0") + +value);
      }
    });

    this.avgPredValues = {};
    for (const [key, val] of sums.entries()) {
      this.avgPredValues[key] = val / this.predictions.length;
    }
    this.chartLabels = Object.keys(this.avgPredValues);
    this.chartDataset.data = this.avgPredValues;
    this.bestLabel = Object.keys(this.avgPredValues).reduce((a, b) => this.avgPredValues[a] > this.avgPredValues[b] ? a : b);
  }
}
