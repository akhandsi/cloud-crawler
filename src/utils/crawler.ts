export class Crawler {
    private element: any;

    constructor(private readonly $: any, private readonly elem: any) {
        this.element = this.$(this.elem);
    }

    public findSelections(selector: string): any {
        return this.element.find(selector);
    }

    public findText(selector: string): string {
        return this.element
            .find(selector)
            .first()
            .text()
            .trim();
    }

    public findAttribute(selector: string, attributeName: string): string {
        return this.element
            .find(selector)
            .first()
            .attr(attributeName)
            .trim();
    }

    public parseTable() {
        const rows: any[] = [];
        this.findSelections('tr')
            .each((k, trElem) => {
                const columns: string[] = []
                const trScrapper = new Crawler(this.$, trElem);
                trScrapper.findSelections('td, th')
                    .each((l, tdElem) => {
                        if (tdElem.children[0].type === 'text') {
                            columns.push(tdElem.children[0].data);
                        } else if (tdElem.children[0].name === 'code') {

                            const values: string[] = [];
                            tdElem.children.forEach((val) => {
                                if (val.children && val.children[0].type === 'text' && !val.children[0].data.includes("\n")) {
                                    values.push(val.children[0].data);
                                }
                            });
                            columns.push(values.join("|"));

                        } else {
                            columns.push(tdElem.children[0].children[0].data);
                        }
                    });

                rows.push(columns);
            });

        const toJsonArray = (matrix) => {
            const header = matrix[0];
            const tableData = matrix.slice(1, matrix.length);

            const formatted = [];
            const l = header.length;
            for (let i=0; i<tableData.length; i++) {
                let d = tableData[i];
                let o = {};

                for (let j=0; j<l; j++) {

                    const value = d[j] || '';
                    o[header[j].trim()] = value.trim();
                }


                // @ts-ignore
                formatted.push(o);
            }
            return formatted;
        }

        return toJsonArray(rows);
    }
}
