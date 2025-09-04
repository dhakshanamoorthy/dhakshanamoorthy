import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportPage = ({ transactions, onStartOver }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="report-container">
                <h2>Monthly Report</h2>
                <p>No transactions were saved for this period.</p>
                <button onClick={onStartOver} className="start-over-btn">Upload More Files</button>
            </div>
        );
    }

    // --- Calculations ---
    const totalExpense = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const categoryTotals = transactions.reduce((acc, tx) => {
        const category = tx.category || 'Uncategorized';
        const amount = parseFloat(tx.amount);
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {});

    const sortedCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a);

    // --- Chart Data ---
    const chartData = {
        labels: sortedCategories.map(([category]) => category),
        datasets: [
            {
                label: 'Expenses',
                data: sortedCategories.map(([, total]) => total),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                    '#FF6384', '#C9CBCF', '#7BC225', '#DE5D83'
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                    '#FF6384', '#C9CBCF', '#7BC225', '#DE5D83'
                ]
            },
        ],
    };

    return (
        <div className="report-container">
            <h2>3. Monthly Report</h2>

            <div className="report-summary">
                <div className="total-expense">
                    <h3>Total Expenses</h3>
                    <p>${totalExpense.toFixed(2)}</p>
                </div>
                <div className="category-chart">
                    <h3>Spending by Category</h3>
                    <Pie data={chartData} />
                </div>
            </div>

            <h3>All Transactions</h3>
            <div className="transactions-table">
                <div className="table-header">
                    <div>Date</div>
                    <div>Amount ($)</div>
                    <div>Category</div>
                    <div className="description-cell">Description</div>
                </div>
                {transactions.map((tx, index) => (
                     <div key={index} className="table-row report-row">
                        <div>{tx.date.split('T')[0]}</div>
                        <div>{parseFloat(tx.amount).toFixed(2)}</div>
                        <div>{tx.category}</div>
                        <div className="description-cell">{tx.description}</div>
                    </div>
                ))}
            </div>

            <div className="report-actions">
                <button onClick={onStartOver} className="start-over-btn">Upload More Files</button>
            </div>
        </div>
    );
};

export default ReportPage;
