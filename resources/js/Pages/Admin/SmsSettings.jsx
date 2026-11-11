import { Head } from '@inertiajs/react';
import { CheckCircle2, Clock, MessageSquareCode, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';
import { formatDate } from '../../utils/format';

export default function SmsSettings({ smsSettings, recentOtps }) {
    return (
        <AdminLayout title="SMS & OTP Configuration">
            <Head title="Admin SMS & OTP" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
                    <div className="flex items-center gap-2.5">
                        <MessageSquareCode className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-base font-bold text-slate-900">Active OTP Gateway</h2>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        Currently running in{' '}
                        <strong className="uppercase text-indigo-600">{smsSettings.active_driver}</strong> mode.
                        When ready for production, plug in your SMS API keys in <code className="rounded bg-slate-100 px-1 py-0.5">.env</code>{' '}
                        and set <code className="rounded bg-slate-100 px-1 py-0.5">SMS_SHOW_OTP_ON_PAGE=false</code>.
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {smsSettings.drivers.map((driver) => {
                            const active = smsSettings.active_driver === driver.key;
                            return (
                                <div
                                    key={driver.key}
                                    className={`rounded-2xl border p-4 ${
                                        active
                                            ? 'border-indigo-600 bg-indigo-50/50'
                                            : 'border-slate-200 bg-slate-50/60'
                                    }`}
                                >
                                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                                        {driver.key}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">{driver.label}</p>
                                    <div className="mt-3">
                                        {active ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                                                <ShieldCheck className="h-3 w-3" /> Active
                                            </span>
                                        ) : driver.configured ? (
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                                                Configured
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                                                Needs .env Keys
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-sm">
                    <h3 className="text-base font-bold text-slate-900">OTP Policy</h3>
                    <dl className="mt-4 space-y-3 text-xs">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">On-Page Sandbox OTP</dt>
                            <dd className="font-bold text-slate-900">
                                {smsSettings.show_otp_on_page ? 'Enabled' : 'Disabled'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">OTP Expiry</dt>
                            <dd className="font-bold text-slate-900">{smsSettings.otp_expiry_minutes} minutes</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Resend Cooldown</dt>
                            <dd className="font-bold text-slate-900">
                                {smsSettings.otp_resend_cooldown_seconds} seconds
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Max Verify Attempts</dt>
                            <dd className="font-bold text-slate-900">{smsSettings.otp_max_attempts}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-base font-bold text-slate-900">Recent OTP Audit Log</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                            <tr>
                                <th className="px-5 py-3">Phone</th>
                                <th className="px-5 py-3">Purpose</th>
                                <th className="px-5 py-3">Driver</th>
                                <th className="px-5 py-3">Attempts</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentOtps.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                                        No OTP codes dispatched yet.
                                    </td>
                                </tr>
                            ) : (
                                recentOtps.map((otp) => (
                                    <tr key={otp.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-3 font-mono text-xs">{otp.phone}</td>
                                        <td className="px-5 py-3 text-xs font-semibold text-slate-700">
                                            {otp.purpose}
                                        </td>
                                        <td className="px-5 py-3 text-xs uppercase text-slate-500">{otp.driver}</td>
                                        <td className="px-5 py-3 text-xs">
                                            {otp.attempts}/{otp.max_attempts}
                                        </td>
                                        <td className="px-5 py-3">
                                            {otp.verified ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                                                    <CheckCircle2 className="h-3 w-3" /> Verified
                                                </span>
                                            ) : otp.expired ? (
                                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
                                                    Expired
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                                    <Clock className="h-3 w-3" /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-xs text-slate-500">
                                            {formatDate(otp.created_at)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

