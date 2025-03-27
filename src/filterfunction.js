function tokenize(query) {
  const OPERATORS = {
    ":": (a, b) => a == b,
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    include: (a, b) => a.includes(b),
  };
  // Escape special characters for regex
  const escapedOperators = Object.keys(OPERATORS)
    .map((op) => op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // Escape regex special characters
    .join("|");

  for (let key in OPERATORS) {
    console.log(key);
  }

  const AND_OR_OPERATORS = ["AND", "OR"];

  const regex = new RegExp(
    `(\\w+)\\s*(${escapedOperators})\\s*("?\\w+"?)?|\\b(${AND_OR_OPERATORS.join(
      "|"
    )})|\\b(true|false)\\b`,
    "g"
  );

  return query.match(regex);
}
function parseTokens(tokens) {
  const output = [];
  const operators = [];

  const precedence = { AND: 2, OR: 1 }; // AND has higher precedence than OR

  while (tokens.length) {
    let token = tokens.shift();

    if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        output.push(operators.pop());
      }
      operators.pop(); // Remove "("
    } else if (token === "AND" || token === "OR") {
      while (
        operators.length &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    } else {
      // Parse field conditions
      const match = token.match(/(\w+)\s*(>=|<=|>|<|:|~)\s*("?[\w\s]+"?)/);
      if (match) {
        let [, field, operator, value] = match;
        value = value.replace(/"/g, ""); // Remove quotes
        output.push({ field, operator, value });
      }
    }
  }

  while (operators.length) {
    output.push(operators.pop());
  }

  return output;
}

export default tokenize;

function evaluateExpression(rpnExpression, obj) {
  const stack = [];

  const operators = {
    ":": (a, b) => a == b,
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    "~": (a, b) => a.includes(b),
  };

  for (const token of rpnExpression) {
    if (typeof token === "object") {
      let { field, operator, value } = token;
      if (!(field in obj)) {
        stack.push(false);
        continue;
      }

      let objValue = obj[field];

      // Convert to number if applicable
      if (!isNaN(objValue) && !isNaN(value)) {
        objValue = Number(objValue);
        value = Number(value);
      }

      stack.push(operators[operator](objValue, value));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(token === "AND" ? a && b : a || b);
    }
  }

  return stack[0];
}

function filterJsonObjects(data, query) {
  let tokens = tokenize(query);

  console.log(tokens);

  if (!tokens) {
    throw new Error("Invalid query " + query);
  }

  const parsedExpression = parseTokens(tokens);

  return data.filter((obj) => evaluateExpression(parsedExpression, obj));
}
