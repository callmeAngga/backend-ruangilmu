const formatChartData = (rawData, chartType) => {
    switch (chartType) {
        case 'line':
            return formatLineChartData(rawData);
        case 'bar':
            return formatBarChartData(rawData);
        case 'pie':
            return formatPieChartData(rawData);
        default:
            return rawData;
    }
};

const formatLineChartData = (rawData) => {
    return {
        labels: rawData.map(item => item.label || item.month),
        datasets: [{
            label: 'Jumlah Pengguna',
            data: rawData.map(item => item.count),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
        }]
    };
};

const formatBarChartData = (rawData) => {
    return {
        labels: rawData.map(item => item.label || item.course_name || item.class),
        datasets: [{
            label: 'Jumlah',
            data: rawData.map(item => item.count || item.certificate_count)
        }]
    };
};

const formatPieChartData = (rawData) => {
    // Aggregate sentiment data across all courses
    const sentimentTotals = {
        positif: 0,
        negatif: 0,
        netral: 0
    };

    rawData.forEach(course => {
        sentimentTotals.positif += course.positif || 0;
        sentimentTotals.negatif += course.negatif || 0;
        sentimentTotals.netral += course.netral || 0;
    });

    return {
        labels: ['Positif', 'Negatif'],
        datasets: [{
            data: [
                sentimentTotals.positif,
                sentimentTotals.negatif,
            ]
        }]
    };
};

const calculatePercentage = (part, total, decimals = 2) => {
    if (total === 0) return 0;
    return parseFloat(((part / total) * 100).toFixed(decimals));
};

module.exports = {
    formatChartData,
    formatLineChartData,
    formatBarChartData,
    formatPieChartData,
    calculatePercentage
};