function isLeapYear(year) {
    return (0 == year % 4 && 0 != year % 100) || 0 == year % 400;
}

const daysInMonth = [31, isLeapYear(new Date().getFullYear()) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const today = function () {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return new Date(`${year}-${month}-${day}`);
};
export const tomorrow = function () {
    const now = new Date();
    let day = now.getDate() + 1;
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    if (day > daysInMonth[month - 1]) {
        // console.log('d');
        day = 1;
        month = month + 1;
    }

    if (month > 12) {
        month = 1;
        year = year + 1;
    }
    return new Date(`${year}-${month}-${day}`);
};
export const currentMonth = function () {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return new Date(`${year}-${month}`);
};
export const nextMonth = function () {
    const now = new Date();
    let month = now.getMonth() + 1 + 1;
    let year = now.getFullYear();
    if (month > 12) {
        month = 1;
        year = year + 1;
    }
    return new Date(`${year}-${month}`);
};
export const currentYear = function () {
    const now = new Date();
    const year = now.getFullYear();
    return new Date(`${year}`);
};
export const nextYear = function () {
    const now = new Date();
    const year = now.getFullYear() + 1;
    return new Date(`${year}`);
};
