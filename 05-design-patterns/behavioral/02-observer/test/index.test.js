import { expect, describe, test, jest, beforeAll } from '@jest/globals';
import PaymentSubject from '../src/subjects/paymentSubject';
import Payment from '../src/events/payment';
import Shipment from '../src/observers/shipment';
import Marketing from '../src/observers/marketing';

describe('Test Suite for Observer Pattern', () => {
  beforeAll(() => {
    jest.spyOn(console, console.log.name).mockImplementation(() => {})
  })
  test('#PaymentSubject notify observers', () => {
    const subject = new PaymentSubject()
    const observer = {
      update: jest.fn()
    }
    const data = 'helo world'

    subject.subscribe(observer)
    subject.notify(data)

    expect(observer.update).toBeCalledWith(data)
  })
  test('#PaymentSubject should not notify unsubscribed observers', () => {
    const subject = new PaymentSubject()
    const observer = {
      update: jest.fn()
    }
    const data = 'helo world'

    subject.subscribe(observer)
    subject.unsubscribe(observer)
    subject.notify(data)

    expect(observer.update).not.toHaveBeenCalled()
  })
  test('#Payment should notify after a credit transaction', () => {
    const subject = new PaymentSubject()
    const payment = new Payment(subject)

    const paymentSubjectNotifierSpy = jest.spyOn(
      payment.paymentSubject,
      payment.paymentSubject.notify.name
    )
    const data = { userName: 'pedroassis', id: Date.now() }
    payment.creditCard(data)
    
    expect(paymentSubjectNotifierSpy).toBeCalledWith(data)
  })
  test('#All should notify subscribers after a credit payment', () => {
    const subject = new PaymentSubject()
    const shipment = new Shipment()
    const marketing = new Marketing()

    const shipmentSpy = jest.spyOn(shipment, shipment.update.name)
    const marketingSpy = jest.spyOn(marketing, marketing.update.name)

    subject.subscribe(shipment)
    subject.subscribe(marketing)

    const payment = new Payment(subject)

    const data = { userName: 'pedroassis', id: Date.now() }
    payment.creditCard(data)

    expect(shipmentSpy).toBeCalledWith(data)
    expect(marketingSpy).toBeCalledWith(data)
  })
})