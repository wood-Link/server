function CurrentTime() {
  const now = new Date();
  const options = { timeZone: "Asia/Seoul" };

  const koreanTime = new Date(now.toLocaleString("en-US", options));

  console.log(koreanTime.getHours());

  const year = koreanTime.getFullYear();
  const month = String(koreanTime.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(koreanTime.getDate()).padStart(2, "0");

  const hours = String(koreanTime.getHours()).padStart(2, "0");
  const minutes = String(koreanTime.getMinutes()).padStart(2, "0");
  const seconds = String(koreanTime.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} (${hours}:${minutes}:${seconds})`;
}

function formatDateTime(input) {
  // Split the input string into date and time parts
  const dateTimeRegex = /(\d{4})-(\d{2})-(\d{2}) \((\d{2}):(\d{2}):(\d{2})\)/;
  const match = input.match(dateTimeRegex);

  if (!match) {
    throw new Error("Invalid input format");
  }

  // Extract the components from the regex match
  const year = match[1];
  const month = match[2];
  const day = match[3];
  let hour = parseInt(match[4], 10); // 24-hour format
  const minute = match[5];
  const second = match[6];

  // Determine AM or PM
  const isPM = hour >= 12;
  const period = isPM ? "오후" : "오전";

  // Convert hour to 12-hour format
  if (hour > 12) {
    hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }

  // Construct the formatted string
  const formattedDate = `${year}년 ${month}월 ${day}일 ${period} ${hour}시 ${minute}분`;

  return formattedDate;
}

module.exports = { CurrentTime, formatDateTime };
