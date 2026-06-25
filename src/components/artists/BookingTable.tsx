import { Booking } from '@/types/artist';

interface Props {
  schedule: Booking[];
}

export default function BookingTable({ schedule }: Props) {
  if (schedule.length === 0) {
    return (
      <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
        <p className="text-gray-500 text-lg">Hiện thợ này chưa có lịch hẹn nào sắp tới.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-5 font-semibold text-gray-600">Khách hàng</th>
            <th className="p-5 font-semibold text-gray-600">Dịch vụ</th>
            <th className="p-5 font-semibold text-gray-600">Thời gian (YYYY-MM-DD)</th>
            <th className="p-5 font-semibold text-gray-600 text-center">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {schedule.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-5 font-medium text-gray-900">{booking.customerDisplayName}</td>
              <td className="p-5 text-gray-700">{booking.serviceName}</td>
              <td className="p-5">
                <div className="font-bold text-gray-800">{booking.bookingDate}</div>
                <div className="text-sm text-gray-500 font-medium mt-1">
                  {booking.startTime} - {booking.endTime}
                </div>
              </td>
              <td className="p-5 text-center">
                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase shadow-sm ${
                  booking.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}