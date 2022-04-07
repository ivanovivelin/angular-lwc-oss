import { api, LightningElement } from 'lwc';
export default class SampleTs extends LightningElement {

    @api name: any;

    fireEvent(event: Event) {

        this.dispatchEvent(
            new CustomEvent('notifyangular', {
                bubbles: true,
                composed: true,
                detail: { isAnimating: true }
            })
        );
    }
}