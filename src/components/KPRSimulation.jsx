import React from 'react';

export default function KPRSimulation() {
    const simulations = [
        {
            id: 1,
            type: 'Tipe Dahlia',
            price: 'Rp 900.000.000',
            dp: 'Rp 90.000.000 (10%)',
            rate: '2,75% (Fix 1 Tahun)',
            installments: [
                { tenure: '10 Tahun', amount: 'Rp 7.726.293 / bulan' },
                { tenure: '15 Tahun', amount: 'Rp 5.496.835 / bulan' },
            ],
            highlight: false
        },
        {
            id: 2,
            type: 'Tipe Pinisi',
            price: 'Rp 850.000.000',
            dp: 'Rp 85.000.000 (10%)',
            rate: '2,75% (Fix 1 Tahun)',
            installments: [
                { tenure: '5 Tahun', amount: 'Rp 14.351.400 / bulan' },
                { tenure: '10 Tahun', amount: 'Rp 8.032.500 / bulan' },
                { tenure: '15 Tahun', amount: 'Rp 5.951.700 / bulan' },
            ],
            highlight: true
        },
        {
            id: 3,
            type: 'Tipe Edelweiss',
            price: 'Rp 1.200.000.000',
            dp: 'Rp 120.000.000 (10%)',
            rate: '2,75% (Fix 1 Tahun)',
            installments: [
                { tenure: '10 Tahun', amount: 'Rp 10.304.391 / bulan' },
                { tenure: '15 Tahun', amount: 'Rp 7.329.113 / bulan' },
            ],
            highlight: false
        }
    ];

    return (
        <section id="simulasi" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Simulasi Angsuran KPR
                    </h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Perkiraan angsuran ringan untuk memudahkan Anda memiliki hunian impian.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {simulations.map((sim) => (
                        <div
                            key={sim.id}
                            data-aos="fade-up"
                            data-aos-delay={sim.id * 100}
                            className={`rounded-2xl overflow-hidden shadow-lg border ${sim.highlight ? 'border-accent ring-1 ring-accent' : 'border-gray-200'} transition-all hover:shadow-xl`}
                        >
                            <div className="bg-gray-50 px-6 py-8 border-b border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900">{sim.type}</h3>
                                <p className="mt-2 text-gray-500">Harga: <span className="text-primary font-semibold">{sim.price}</span></p>
                            </div>
                            <div className="p-6 bg-white space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Uang Muka (10%)</span>
                                    <span className="font-medium text-gray-900">{sim.dp}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Suku Bunga</span>
                                    <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{sim.rate}</span>
                                </div>

                                <div className="pt-4">
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Estimasi Angsuran</p>
                                    <div className="space-y-3">
                                        {sim.installments.map((inst, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700 font-medium">{inst.tenure}</span>
                                                <span className="text-primary font-bold">{inst.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        *Simulasi di atas adalah estimasi dan dapat berubah sewaktu-waktu sesuai kebijakan bank.
                    </p>
                </div>
            </div>
        </section>
    );
}
