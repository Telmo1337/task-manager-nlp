import { interpret } from "./core";
import { initialState } from "./core/state/types";

let state = initialState;

function run(input: string) {
  console.log("\nUSER >", input);

  const response = interpret(input, state);

  console.log("SYSTEM >", response.result);
  console.log("STATE  >", response.state);

  state = response.state;
}

// TESTES
run("add study english tomorrow");
run("list all tasks for today");
run("add study tomorrow and list tasks for today");
run("delete study english");
run("asdf qwerty");


run("add study english tomorrow");
run("add study tomorrow at 5pm");
run("add study tomorrow or day after tomorrow");


run("add study english tomorrow at 10am");