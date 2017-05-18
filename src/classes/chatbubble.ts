
export default class Chatbubble {
    
    private container: HTMLElement;
    
    constructor(text: string) {
        this.container = document.createElement('div');
        this.container.innerText = text;
        this.container.style.left = '0px';
        this.container.style.top = '0px';        
        this.container.className = 'speechbubble';
        document.body.appendChild(this.container);
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
    
    public settext(message) {
        this.container.innerText = message;
    }
    
    public destroy() {
        this.container.parentElement.removeChild(this.container);
    }
}