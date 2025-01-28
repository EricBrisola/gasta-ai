import dayjs from "dayjs";

const thisYear = dayjs().year()

export const months = [
    { month: "Todos", value: "none" },
    { month: "Janeiro", value: dayjs(`${thisYear + ""}-01-01`).valueOf() },
    { month: "Fevereiro", value: dayjs(`${thisYear + ""}-02-01`).valueOf() },
    { month: "Março", value: dayjs(`${thisYear + ""}-03-01`).valueOf() },
    { month: "Abril", value: dayjs(`${thisYear + ""}-04-01`).valueOf() },
    { month: "Maio", value: dayjs(`${thisYear + ""}-05-01`).valueOf() },
    { month: "Junho", value: dayjs(`${thisYear + ""}-06-01`).valueOf() },
    { month: "Julho", value: dayjs(`${thisYear + ""}-07-01`).valueOf() },
    { month: "Agosto", value: dayjs(`${thisYear + ""}-08-01`).valueOf() },
    { month: "Setembro", value: dayjs(`${thisYear + ""}-09-01`).valueOf() },
    { month: "Outubro", value: dayjs(`${thisYear + ""}-10-01`).valueOf() },
    { month: "Novembro", value: dayjs(`${thisYear + ""}-11-01`).valueOf() },
    { month: "Dezembro", value: dayjs(`${thisYear + ""}-12-01`).valueOf() },
];

// date format YYYY-MM-DD
