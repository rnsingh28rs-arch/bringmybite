export const calculateSubscriptionPricing=(standardAmount=3700,amountPaid=0)=>{
  const standard=Math.max(0,Number(standardAmount)||0);
  const paid=Math.max(0,Number(amountPaid)||0);
  return {standardAmount:standard,amountPaid:paid,discountAmount:Math.max(0,standard-paid)};
};

export const buildSubscriptionReceiptText=({receiptNumber,customerName,packageType,standardAmount=3700,amountPaid=0,discountReason=''})=>{
  const p=calculateSubscriptionPricing(standardAmount,amountPaid);
  const money=n=>`₹${n.toLocaleString('en-IN')}`;
  return [
    'Bring My Bite Subscription Receipt',
    `Receipt: ${receiptNumber||'—'}`,
    `Subscriber: ${customerName||'—'}`,
    `Plan: ${packageType||'—'}`,
    `Standard Price: ${money(p.standardAmount)}`,
    `Discount: ${money(p.discountAmount)}`,
    `Actual Amount Paid: ${money(p.amountPaid)}`,
    p.discountAmount>0?`Reason: ${discountReason||'—'}`:null,
  ].filter(Boolean).join('\n');
};
