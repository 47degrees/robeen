import { Component, Prop } from '@stencil/core'
import { JMHDataKeys } from '@app/types/types';

@Component({
    tag: 'fortyseven-robeen',
})
export class Robeen {
    @Prop() dataUrl!: string;
    hoodData?: JMHDataKeys = {};

    async componentWillLoad() {

        try {
            if (this.dataUrl) {
                const response = await fetch(this.dataUrl);
                const data = await response.json();

                // Getting non-duplicated project names of each benchmark
                const keynames =
                    [...new Set(data.map(
                        metric => this.getKeyName(metric.benchmark.split('.'))
                    ).filter(value => value))]

                keynames.forEach((name: string) => {
                    this.hoodData[name] = data.filter(
                        metric => this.getKeyName(metric.benchmark.split('.')) === name)
                })

            } else {
                console.warn('No URL to fetch the JMH JSON data from has been set.')
            }
        } catch (e) {
            console.warn('Impossible to fetch a valid JMH JSON data, please check the URL.')
        }
    }

    /**
     * Getting project name from benchmark metric string
     */
    private getKeyName(projectArray: Array<string>): string {
        const { length, [length - 2]: name } = projectArray;
        return name
    }

    render() {
        return (
            <div>
                {Object.keys(this.hoodData).map((key: string) => (
                    <div>
                        <h2>{key}</h2>
                        <robeen-chart metrics={this.hoodData[key]}></robeen-chart>
                    </div>
                ))}
            </div>
        );
    }
}
