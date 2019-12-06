import { Component, OnInit } from '@angular/core';
import { ColorPaletteGenerator } from '@app/helpers/chart-palette-generator';

@Component({
  selector: 'app-forecast-supply',
  templateUrl: './forecast-supply.component.html',
  styleUrls: ['./forecast-supply.component.scss']
})
export class ForecastSupplyComponent implements OnInit {

  private readonly MOCK_DATA_MAX_VALUE_EXCLUSIVE: number = 101;
  private readonly MOCK_DATA_MONTH_RANGE: number = 24;

  private useResizeHandler: boolean;

  private barPlot: any = {
    data: [
      {
        y: [], x: [], type: 'bar',
        marker: {
          color: []
        }
      }
    ],
    layout: {
      title: 'Available Quantity',
      plot_bgcolor: '#fafafa',
      paper_bgcolor: '#fafafa',
      margin: {
        b: 96
      }
    },
    config: {
      displaylogo: false
    }
  };

  constructor() {
    this.useResizeHandler = true;
  }

  public ngOnInit(): void {
    const mockYData: number[] = this.getMockYData(this.MOCK_DATA_MONTH_RANGE);
    const mockXData: string[] = this.getMockXData(this.MOCK_DATA_MONTH_RANGE);
    const paletteGenerator: ColorPaletteGenerator = new ColorPaletteGenerator();
    const mockPalette: Array<string> = paletteGenerator.getPaletteForBins(mockXData.length);
    this.barPlot.data[0].y = mockYData;
    this.barPlot.data[0].x = mockXData;
    this.barPlot.data[0].marker.color = mockPalette;
  }

  public getBarPlot(): any {
    return this.barPlot;
  }

  public getUseResizeHandler(): boolean {
    return this.useResizeHandler;
  }

  private formatMockDate(dateToFormat: Date): string {
    return dateToFormat.getMonth() + '/' + dateToFormat.getDate() + '/' + dateToFormat.getFullYear();
  }

  private getMockXData(targetMonths: number): string[] {
    const mockYData: string[] = [];
    const currentDate: Date = new Date();

    // Zero-indexed
    currentDate.setMonth(currentDate.getMonth() + 1);

    for (let i = 0; i < targetMonths; ++i) {
      currentDate.setMonth(currentDate.getMonth() + 1);
      mockYData.push(this.formatMockDate(currentDate));
    }

    return mockYData;
  }

  private getMockYData(targetMonths: number): number[] {
    const mockXData: number[] = [];

    for (let i = 0; i < targetMonths; ++i) {
      // Random [0 - 100]
      mockXData.push(Math.floor(Math.random() * this.MOCK_DATA_MAX_VALUE_EXCLUSIVE));
    }

    return mockXData;
  }
}
