import React, { useState } from 'react';
import { Pagination } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomPagination({
    currentPage,
    totalPages,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange,
    totalItems,
}) {
    const [goToPage, setGoToPage] = useState('');

    if (totalItems === 0) return null;

    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);

    const handleGoToPage = (e) => {
        e.preventDefault();
        const page = Number(goToPage);
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            setGoToPage('');
        }
    };

    return (
        <div className="mt-4 px-5 py-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Summary text */}
            <div className="flex items-center gap-3 text-sm text-default-600 dark:text-default-400 whitespace-nowrap order-2 sm:order-1">
                <span>
                    <span className="text-black dark:text-default-200 font-semibold">{startItem}</span>
                    <span className="mx-1">–</span>
                    <span className="text-black dark:text-default-200 font-semibold">{endItem}</span>
                    <span className="mx-1.5">of</span>
                    <span className="text-black dark:text-default-200 font-semibold">{totalItems}</span>
                </span>

                {/* Per page selector */}
                <span className="text-default-600 dark:text-default-500">|</span>
                <div className="flex items-center gap-1.5">
                    {[10, 20, 50].map((size) => (
                        <button
                            key={size}
                            onClick={() => onRowsPerPageChange(size)}
                            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all duration-200
                                ${rowsPerPage === size
                                    ? 'bg-theme-500/20 text-theme-600 dark:text-theme-300 border border-theme-500/30'
                                    : 'bg-black/5 dark:bg-white/5 text-default-600 dark:text-default-400 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-default-200 border border-transparent'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                    <span className="text-xs text-default-600 dark:text-default-500 ml-0.5">/ page</span>
                </div>
            </div>

            {/* Center: Pagination controls */}
            <div className="flex items-center gap-3 order-1 sm:order-2">
                {totalPages > 1 && (
                    <>
                        {/* Previous button */}
                        <button
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
                                ${currentPage <= 1
                                    ? 'opacity-30 cursor-not-allowed text-default-400 dark:text-default-500'
                                    : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-default-600 dark:text-default-300 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'
                                }`}
                        >
                            <ChevronLeft size={14} />
                            <span className="hidden sm:inline">Prev</span>
                        </button>

                        {/* Page numbers */}
                        <Pagination
                            isCompact
                            showShadow
                            color="secondary"
                            page={currentPage}
                            total={totalPages}
                            onChange={onPageChange}
                            classNames={{
                                wrapper: "gap-1",
                                cursor: "bg-theme-500/80 text-white font-bold shadow-lg shadow-theme-500/20",
                                item: "bg-black/5 dark:bg-white/5 text-default-600 dark:text-default-400 hover:bg-black/10 dark:hover:bg-white/10 data-[hover=true]:bg-black/10 dark:data-[hover=true]:bg-white/10 border-0 font-medium",
                            }}
                        />

                        {/* Nextt button */}
                        <button
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
                                ${currentPage >= totalPages
                                    ? 'opacity-30 cursor-not-allowed text-default-400 dark:text-default-500'
                                    : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-default-600 dark:text-default-300 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'
                                }`}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight size={14} />
                        </button>
                    </>
                )}

                {/* Go to page */}
                {totalPages > 2 && (
                    <form onSubmit={handleGoToPage} className="flex items-center gap-1.5 ml-2">
                        <span className="text-xs text-default-600 dark:text-default-500 whitespace-nowrap">Go to</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={goToPage}
                            onChange={(e) => setGoToPage(e.target.value)}
                            placeholder="#"
                            className="w-12 h-7 text-center text-xs font-medium rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-default-200 placeholder:text-default-400 dark:placeholder:text-default-500 focus:outline-none focus:border-theme-500/50 focus:bg-black/10 dark:focus:bg-white/10 transition-all"
                        />
                        <span className="text-xs text-default-600 dark:text-default-500">Page</span>
                    </form>
                )}
            </div>
        </div>
    );
}
