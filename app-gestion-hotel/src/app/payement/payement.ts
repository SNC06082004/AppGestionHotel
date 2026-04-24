import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MethodePaiement {
  id: string;
  name: string;
  sub: string;
  initials: string;
  iconClass: string;
  mobile: boolean;
}

@Component({
  selector: 'app-payement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payement.html',
  styleUrls: ['./payement.css']
})
export class Payement {

  @Input() isVisible = false;
  @Input() total = 0;
  @Input() nights = 0;
  @Input() chambres = 1;
  @Input() adultes = 1;
  @Output() closed = new EventEmitter<void>();
  @Output() paid = new EventEmitter<string>();

  selectedMethod = 'om';
  phoneNumber = '';
  paymentSuccess = false;
  refCode = '';

  card = { number: '', expiry: '', cvv: '' };

  methods: MethodePaiement[] = [
    { id: 'om',   name: 'Orange Money',  sub: 'Paiement par mobile money', initials: 'OM', iconClass: 'icon-om',   mobile: true  },
    { id: 'moov', name: 'Moov Money',    sub: 'Paiement par mobile money', initials: 'MM', iconClass: 'icon-moov', mobile: true  },
    { id: 'tel',  name: 'Telecel Money', sub: 'Paiement par mobile money', initials: 'TM', iconClass: 'icon-tel',  mobile: true  },
    { id: 'card', name: 'Carte bancaire',sub: 'Visa · Mastercard',         initials: '',   iconClass: 'icon-card', mobile: false },
  ];

  get isMobile(): boolean {
    return this.methods.find(m => m.id === this.selectedMethod)?.mobile ?? false;
  }

  selectMethod(id: string): void {
    this.selectedMethod = id;
  }

  confirmPayment(): void {
    this.refCode = 'LXR-' + Math.floor(100000 + Math.random() * 900000);
    this.paymentSuccess = true;
    this.paid.emit(this.refCode);
  }

  close(): void {
    this.paymentSuccess = false;
    this.selectedMethod = 'om';
    this.phoneNumber = '';
    this.card = { number: '', expiry: '', cvv: '' };
    this.closed.emit();
  }
}