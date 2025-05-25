const PAYMENT_LIMIT = 2;
const ATTEMPT_LIMIT = 6;
const RETRY_DELAY = [2, 5, 10, 20, 30, 60];

class PaymentProcessor {
  constructor() {
    this.payments = [];
    this.paymentIdCounter = 0;
    this.randomGeneratedId = Math.floor(Math.random() * PAYMENT_LIMIT);
    this.addInterval = null;
    this.processInterval = null;
    this.existingIds = new Set();
  }

  generateRandomTransaction() {
    let id = Math.floor(Math.random() * PAYMENT_LIMIT);

    do {
      id = Math.floor(Math.random() * PAYMENT_LIMIT);
    } while (this.existingIds.has(id));

    this.existingIds.add(id);

    const amount = Math.floor(Math.random() * (PAYMENT_LIMIT - 10 + 1)) + 10;

    return {
      id,
      amount,
      timestamp: new Date().toISOString(),
      attempts: 0,
      status: "pending",
    };
  }

  start() {
    this.addInterval = setInterval(() => this.addTransaction(), 1000);
    this.processInterval = setInterval(() => this.processPayments(), 1000);
  }

  addTransaction() {
    if (this.paymentIdCounter >= PAYMENT_LIMIT) {
      clearInterval(this.addInterval);
      console.log("Payment limit reached, no more transactions will be added.");
      return;
    }

    const trx = this.generateRandomTransaction();
    this.payments.push(trx);
    this.paymentIdCounter++;
    console.log("New transaction added:", trx);
  }

  processPayments() {
    if (this.paymentIdCounter >= PAYMENT_LIMIT) {
      clearInterval(this.processInterval);
      console.log("Payment limit reached, stopping payment processing.");
    }

    const pendingOrFailedPayments = this.payments.filter(
      (p) => p.status === "pending" || p.status === "failed",
    );
    if (pendingOrFailedPayments.length === 0) {
      console.log("No payments to process.");
      console.log("Stopping payment processing.");
      clearInterval(this.processInterval);
      console.log("payments:", this.payments);
      return;
    }

    pendingOrFailedPayments.forEach((payment) => {
      try {
        if (payment.id === this.randomGeneratedId) {
          payment.status = "success";
          console.log(`Payment ${payment.id} processed successfully.`);
          // update payments
          const updatedPayments = this.payments.map((p) =>
            p.id === payment.id ? payment : p,
          );
          this.payments = updatedPayments;
          return;
        } else {
          payment.status = "failed";
          const updatedPayments = this.payments.map((p) =>
            p.id === payment.id ? payment : p,
          );
          this.payments = updatedPayments;
        }

        if (payment.attempts < ATTEMPT_LIMIT) {
          payment.attempts++;
          console.log(
            `Processing payment ${payment.id}, attempt ${payment.attempts}`,
          );

          setTimeout(
            () => {
              this.processPayments();
            },
            RETRY_DELAY[payment.attempts - 1] * 1000,
          );
        } else {
          payment.status = "rejected";
          console.log(
            `Payment ${payment.id} rejected after ${ATTEMPT_LIMIT} attempts`,
          );
        }
      } catch (error) {
        console.error(`Error processing payment ${payment.id}:`, error);
      }
    });
  }
}

// Usage
const processor = new PaymentProcessor();
processor.start();
