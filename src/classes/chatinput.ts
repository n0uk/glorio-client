export default class Chatinput {
    
    private container: HTMLElement;
    private input: HTMLInputElement;
    private callback;
    private cancelcallback;
    
    constructor(callback, cancelcallback) {
        this.callback = callback;
        this.cancelcallback = cancelcallback;
        
        this.container = document.createElement('div');
        this.container.style.left = '0px';
        this.container.style.top = '0px';
        this.container.className = 'speechbubble';
        
        this.input = <HTMLInputElement>document.createElement('input');
        this.input.type = 'text';
        this.input.maxLength = 60;
        this.container.appendChild(this.input);
        let self = this;
        this.input.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
                self.send();
            }
        });
        this.input.addEventListener('keydown', function(e) {
            if (e.keyCode === 27) {
                self.cancel();
            }
        });
        document.body.appendChild(this.container);
        this.input.focus();
    }
    
    public cancel() {
        this.cancelcallback();
    }
    
    public send() {
        this.callback(this.input.value);
    }
    
    public setposition(x: number, y: number) {
        x = Math.round(x);
        y = Math.round(y);
        let width: number = this.container.offsetWidth;
        let height: number = this.container.offsetHeight;
        x = x - width / 2;
        y = y - height;
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
    }

    public destroy() {
        this.container.parentElement.removeChild(this.container);
    }
}