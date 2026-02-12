import dayjs from 'dayjs';

// тут нужно бы проверить строку dueDate на число символов, чтобы формат соотвествовал.!

/**
 * @param {string} - строка с иоходным значением даты
 * @param {string} - строка нового формата даты
 * @returns {string} возвращает строку в формате @dateFormat
 */
function convertDateFromat(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

/**
 * @param {string}  строка с текущем форматом даты
 * @param {string} новый формат даты
 * @returns {string} строка с датой в новом формате
 */
function shortenDateString(dueDate, dueDateLength = 16) {
  return (dueDate.length > dueDateLength) ? dueDate.slice(0, dueDateLength) : dueDate;
}
/**
 * @param {string} date1 формата 'YYYY-MM-DDThh:mm:ss.234Z'
 * @param {string} date2 формата '2019-07-20T16:45:30.234Z'
 * @returns {string} минуты и часы
 */
function dateDifferenceHoursMinutes(date1, date2) {
  const minutesInHour = 60;
  const hoursInDay = 24;
  // 2019-07-20T16:45:30.234Z
  // '2024-05-20 23:00'
  const initialDate1 = `${date1.slice(0, 10)} ${date1.slice(11, 16)}`;
  const initialDate2 = `${date2.slice(0, 10)} ${date2.slice(11, 16)}`;

  // const initialDate1 = '2019-07-20 16:45';
  // const initialDate2 = '2019-07-24 19:50';

  const date1js = dayjs(initialDate1);
  const date2js = dayjs(initialDate2);

  const difference = date2js.diff(date1js, 'minutes');
  let finalDifference = '';

  if (difference > minutesInHour) {
    const minutes = difference % minutesInHour;
    let hours = (difference - minutes) / minutesInHour;

    if (hours < 10) {

      finalDifference += `0${hours}H`;
      finalDifference += (minutes < 10) ? ` 0${minutes}M` : ` ${minutes}M`;
    } else if (hours > hoursInDay) {

      const days = (hours - hours % hoursInDay) / hoursInDay;
      hours = hours % hoursInDay;

      if (days < 10) {
        finalDifference += `0${days}D`;
        if (hours < 10) {
          finalDifference += ` 0${hours}H`;
          finalDifference += (minutes < 10) ? ` 0${minutes}M` : ` ${minutes}M`;
        } else {
          finalDifference += ` ${hours}H`;
          finalDifference += (minutes < 10) ? ` 0${minutes}M` : ` ${minutes}M`;
        }

      } else {
        finalDifference += `${days}D`;
        if (hours < 10) {
          finalDifference += ` 0${hours}H`;
          finalDifference += (minutes < 10) ? ` 0${minutes}M` : ` ${minutes}M`;
        } else {
          finalDifference += ` ${hours}H`;
          finalDifference += (minutes < 10) ? ` 0${minutes}M` : ` ${minutes}M`;
        }
      }
    } else {
      finalDifference += `${hours}H`;
      finalDifference += (minutes < 10) ? ` 0${minutes}M` : ` ${minutes}M`;
    }
  } else {
    finalDifference += (difference > 10) ? `${difference}MM` : `0${difference}MM`;
  }

  return finalDifference;
}

function isEventDateExpired(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

function isEventDateInPresent(dueDateStart, dueDateEnd) {
  const condition1 = dayjs().isSame(dueDateStart) || dayjs().isAfter(dueDateStart);
  const condition2 = dayjs().isSame(dueDateEnd) || dayjs().isBefore(dueDateEnd);
  const condition3 = dueDateEnd && dueDateStart;
  return condition1 && condition2 && condition3;
}


function isEventDateInFuture(dueDate) {
  return dueDate && dayjs().isBefore(dueDate, 'D');
}


export {isEventDateExpired, isEventDateInPresent, isEventDateInFuture, convertDateFromat, shortenDateString, dateDifferenceHoursMinutes };
