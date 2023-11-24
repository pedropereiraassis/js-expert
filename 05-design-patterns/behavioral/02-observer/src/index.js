import Payment from "./events/payment.js";
import Marketing from "./observers/marketing.js";
import Shipment from "./observers/shipment.js";
import PaymentSubject from "./subjects/paymentSubject.js";

const subject = new PaymentSubject()
const marketing = new Marketing()
subject.subscribe(marketing)

const shipment = new Shipment()
subject.subscribe(shipment)

const payment = new Payment(subject)
payment.creditCard({ username: 'pedroassis', id: Date.now() })

subject.unsubscribe(marketing)
// only dispatch event to shipment
payment.creditCard({ username: 'johndoe', id: Date.now() })
