import jsPDF from "jspdf"

export function generateReceipt(order, user) {
  const doc = new jsPDF({ unit: "pt", format: "a4" })

  const indigo = [67, 56, 202]
  const slate = [100, 116, 139]
  const dark = [15, 23, 42]

  let y = 60
 
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(...dark)
  doc.text("codevolve", 50, y)
  doc.setTextColor(...indigo)
  doc.text("X", 50 + doc.getTextWidth("codevolve"), y)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...slate)
  doc.text("Payment Receipt", 50, y + 18)

  doc.setDrawColor(226, 232, 240)
  doc.line(50, y + 35, 545, y + 35)

  y += 65
 
  doc.setFontSize(10)
  doc.setTextColor(...slate)
  doc.text("Receipt Date", 50, y)
  doc.text("Payment ID", 300, y)

  doc.setFont("helvetica", "bold")
  doc.setTextColor(...dark)
  doc.text(
    new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    50,
    y + 16
  )
  doc.setFontSize(9)
  doc.text(order.razorpay_payment_id || "—", 300, y + 16)

  y += 45

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...slate)
  doc.text("Billed To", 50, y)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(...dark)
  doc.text(`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(), 50, y + 16)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...slate)
  doc.text(user?.email ?? "", 50, y + 30)

  y += 60
 
  doc.setFillColor(248, 250, 252)
  doc.rect(50, y, 495, 28, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...slate)
  doc.text("COURSE", 60, y + 18)
  doc.text("AMOUNT", 480, y + 18, { align: "right" })

  y += 28
 
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...dark)

  const courses = order.courses || []
  const perCoursePrice = courses.length ? order.amount / courses.length : order.amount

  courses.forEach((course) => {
    y += 28
    doc.text(course.courseName || "Course", 60, y)
    doc.text(
      `Rs. ${Math.round(perCoursePrice).toLocaleString("en-IN")}`,
      485,
      y,
      { align: "right" }
    )
    doc.setDrawColor(241, 245, 249)
    doc.line(50, y + 10, 545, y + 10)
  })

  y += 40

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(...dark)
  doc.text("Total Paid", 60, y)
  doc.setTextColor(...indigo)
  doc.text(`Rs. ${order.amount?.toLocaleString("en-IN")}`, 485, y, { align: "right" })

  y += 60

  doc.setDrawColor(226, 232, 240)
  doc.line(50, y, 545, y)

  y += 25
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(...slate)
  doc.text(
    "This is a computer-generated receipt and does not require a signature.",
    50,
    y
  )
  doc.text("CodevolveX · support@codevolvex.com", 50, y + 14)

  doc.save(`CodevolveX-Receipt-${order.razorpay_payment_id || order._id}.pdf`)
}