'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  rowKey?: keyof T | ((row: T) => string);
}

export function Table<T extends object>({
  columns,
  data,
  loading = false,
  emptyMessage = '暂无数据',
  onRowClick,
  rowKey,
}: TableProps<T>) {
  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(row);
    if (rowKey && row) return String((row as Record<string, unknown>)[rowKey as string]);
    return String(index);
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-700/50 border-b border-gray-700/50" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-gray-700/50 flex items-center px-6 gap-4">
              {columns.map((_, j) => (
                <div key={j} className="h-4 bg-gray-700/50 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50 bg-gray-800/30">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider
                    ${alignClasses[column.align || 'left']}
                  `}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <motion.tr
                  key={getRowKey(row, index)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onRowClick?.(row, index)}
                  className={`
                    border-b border-gray-700/30 transition-colors
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-700/30' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        px-6 py-4 text-sm text-gray-300
                        ${alignClasses[column.align || 'left']}
                      `}
                    >
                      {column.render
                        ? column.render((row as Record<string, unknown>)[column.key], row, index)
                        : String((row as Record<string, unknown>)[column.key] ?? '-')}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
