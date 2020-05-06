function stringToQuery(string) {
  let array = string.split("");
  for(let i = 0; i < array.length; i++) {
      if(array[i] === " ") {
          array.splice(i, 1, "%20");
      }
  }
  return array.join("");
}

exports.stringToQuery = stringToQuery;