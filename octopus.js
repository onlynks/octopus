export default class Octopus extends HTMLButtonElement {

    buttons;
    radius = 150;
    hoverArea;
    hoverAreaRadius = this.radius + 15;
    transition = 300;

    buttonElements = [];

    constructor() {
        super();

        this.buttons = JSON.parse(this.getAttribute("buttons"));
        this.hoverArea = document.createElement("div");
        this.hoverArea.classList.add("hover-area");
        this.setDefaultStyle();
        this.addEvents();
    }

    addEvents() {

        this.onclick = () => {
            document.body.appendChild(this.hoverArea);
            this.animateHoverAreaOpacity(1);

            this.drawButtons();
            const clientRect = this.getBoundingClientRect();

            this.hoverArea.style.left = (clientRect.x + clientRect.width / 2) - this.hoverAreaRadius + "px";
            this.hoverArea.style.top = clientRect.bottom - this.hoverAreaRadius + "px";
        }

        this.hoverArea.onmouseleave = () => {
            this.buttonElements.forEach(buttonElement => {
                const defaultCoordinates = this.getDefaultPosition(buttonElement);
                this.animateButtonOut(buttonElement, defaultCoordinates).onfinish = () => buttonElement.remove();
            })
            this.buttonElements.length = 0;
            this.animateHoverAreaOpacity(0).onfinish = () => this.hoverArea.remove();
            this.blur();
        }
    }

    drawButtons() {

        this.buttons.forEach((button, index) => {
            const buttonElement = document.createElement("button");
            buttonElement.innerHTML = button.label;
            buttonElement.classList.add("octopus-button");

            this.hoverArea.appendChild(buttonElement);

            const defaultCoordinates = this.getDefaultPosition(buttonElement);
            const finalCoordinates = this.getButtonCoordinates(buttonElement, index);

            this.animateButtonIn(buttonElement, defaultCoordinates, finalCoordinates);
            buttonElement.onclick = () => window[button.action](this);
            // window[button.action](this)
            this.buttonElements.push(buttonElement);
        })
    }

    getDefaultPosition(buttonElement) {
        const clientRect = this.getBoundingClientRect();

        return {
            x: (clientRect.x + clientRect.width / 2) - (buttonElement.offsetWidth / 2),
            y: clientRect.y - buttonElement.offsetHeight
        }
    }

    getButtonCoordinates(buttonElement, index) {
        const clientRect = this.getBoundingClientRect();
        const angleBetween = 180 / this.buttons.length;
        const angle = angleBetween * (index + 1) - angleBetween / 2 - 180;

        const xOnCircle = Math.cos(angle * Math.PI / 180) * this.radius;
        const direction = Math.sign(angle + 90);
        let selfOffset = 0;

        if (direction === -1) {
            selfOffset = buttonElement.offsetWidth * direction;
        }

        if (direction === 0) {
            selfOffset = buttonElement.offsetWidth / 2 * -1;
        }

        const x = clientRect.x + clientRect.width / 2 + xOnCircle + selfOffset;

        const yOnCircle = Math.sin(angle * Math.PI / 180) * this.radius;
        const y = clientRect.y + clientRect.height / 2 + yOnCircle;

        return {
            x: x,
            y: y
        }
    }

    animateButtonIn(buttonElement, defaultCoordinates, finalCoordinates) {
        const keyFrames = [
            {
                left: defaultCoordinates.x + "px",
                top: defaultCoordinates.y + "px"
            },
            {
                left: finalCoordinates.x + "px",
                top: finalCoordinates.y + "px",
            }
        ];

        const animationOptions = {
            duration: this.transition,
            fill: "forwards"
        };

        buttonElement.animate(keyFrames, animationOptions);
    }

    animateButtonOut(buttonElement, defaultCoordinates) {
        const keyFrames = [
            {
                // opacity: 0,
                left: defaultCoordinates.x + "px",
                top: defaultCoordinates.y + "px"
            }
        ];

        const animationOptions = {
            duration: this.transition,
            fill: "forwards"
        };

        return buttonElement.animate(keyFrames, animationOptions);
    }

    animateHoverAreaOpacity(opacity) {
        const keyFrames = [
            {
                opacity: opacity
            }
        ];

        const animationOptions = {
            duration: this.transition,
            fill: "forwards"
        };

        return this.hoverArea.animate(keyFrames, animationOptions);
    }

    setDefaultStyle() {
        if (!document.getElementById("octopus-style")) {
            const css = `
                .hover-area {
                    position: fixed;
                    z-index: 97;
                    opacity: 0;
                    height: ${this.hoverAreaRadius}px;
                    width: ${this.hoverAreaRadius * 2}px;
                    background: linear-gradient(#c7c5c5, transparent);
                    border-radius: ${this.hoverAreaRadius}px ${this.hoverAreaRadius}px 0 0;
                }

                .octopus-button {
                    position: fixed;
                    z-index: 99;
                    border: none;
                    background-color: #4e4e4e;
                    border-radius: 15px;
                    padding: 5px 15px;
                    color: #ffffff;
                    box-shadow: 0 2px 15px #585757;
                }

                button.octopus-button:hover {
                    box-shadow: 0 0 0 3px #2ab890;
                    background-color: #fff;
                    color: #2ab890;
                }
            `;

            const style = document.createElement("style");
            style.appendChild(document.createTextNode(css));
            style.id = "octopus-style";
            document.head.appendChild(style);
        }
    }


}

customElements.define("octopus-ce", Octopus, { extends: "button" });