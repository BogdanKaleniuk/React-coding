import { Component } from 'react';
import { createPortal } from 'react-dom';
import { ModalBackdrop, ModalContent } from './Modal.styled';


const modalRoot = document.querySelector('#modal-root')
export default class Modal extends Component {
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown)
    }
    componentWillUnmount() {
        window.addEventListener('keydown', this.handleKeyDown) 
    }
handleKeyDown = e => {
        if (e.code === 'Escape') {
                console.log('нажали на ESC')
                this.props.onClose();
            } 
    };

render() {
    return createPortal(
            <ModalBackdrop className="Modal__backdrop">
                <ModalContent className="Modal__content">{this.props.children}</ModalContent>
            </ModalBackdrop>,
            modalRoot
    )
};
};