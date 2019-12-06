export class ColorPaletteGenerator {

    public readonly CHART_PALLETE_DEFAULT_HEX_COUNT: number = 8;
    public readonly CHART_PALETTE_DEFAULT_HEX: Array<string> = [
        '#003f5c',
        '#2f4b7c',
        '#665191',
        '#a05195',
        '#d45087',
        '#f95d6a',
        '#ff7c43',
        '#ffa600'
    ];

    public getPaletteForBins(numberOfBins: number): Array<string> {
        const newPalette: Array<string> = new Array<string>();
        let paletteLength = 0;
        let currentIndex = 0;

        while (paletteLength < numberOfBins) {
            newPalette.push(this.CHART_PALETTE_DEFAULT_HEX[currentIndex]);

            paletteLength++;
            currentIndex++;

            if (currentIndex === this.CHART_PALLETE_DEFAULT_HEX_COUNT) {
                currentIndex = 0;
            }
        }

        return newPalette;
    }
}
