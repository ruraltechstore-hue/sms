import { FeePayment } from "@/lib/mock-fees";
import { Separator } from "@/components/ui/separator";

interface FeeReceiptProps {
  payment: FeePayment;
}

export function FeeReceipt({ payment }: FeeReceiptProps) {
  return (
    <div className="bg-card rounded-xl p-6 space-y-4 text-sm">
      <div className="text-center space-y-1">
        <h3 className="font-heading font-bold text-lg">Vidyalaya School</h3>
        <p className="text-muted-foreground text-xs">123 Education Lane, Knowledge City</p>
        <p className="text-muted-foreground text-xs">Phone: +91 98765 43210</p>
      </div>

      <Separator />

      <div className="flex justify-between">
        <span className="text-muted-foreground">Receipt No.</span>
        <span className="font-semibold">{payment.receiptNo}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Date</span>
        <span>{payment.paidDate}</span>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Student Name</span>
          <span className="font-medium">{payment.studentName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Class & Section</span>
          <span>{payment.class}-{payment.section}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Student ID</span>
          <span>{payment.studentId}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee Type</span>
          <span>{payment.feeType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Amount</span>
          <span>₹{payment.amount.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>Amount Paid</span>
          <span className="text-success">₹{payment.paidAmount.toLocaleString("en-IN")}</span>
        </div>
        {payment.amount > payment.paidAmount && (
          <div className="flex justify-between text-destructive">
            <span>Balance Due</span>
            <span>₹{(payment.amount - payment.paidAmount).toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Method</span>
          <span className="capitalize">{payment.method}</span>
        </div>
      </div>

      <Separator />

      <p className="text-center text-xs text-muted-foreground italic">
        This is a computer-generated receipt. No signature required.
      </p>
    </div>
  );
}
