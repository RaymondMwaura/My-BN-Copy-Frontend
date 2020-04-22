import reducer from "../../store/reducers/markAsReadReducer";
import {
  MARKED_AS_READ_FAILURE,
  MARKED_AS_READ_SUCCESS
} from "../../store/actions/types";

describe("", () => {
  it("should \"MARKED_AS_READ_SUCCESS\"", () => {
    expect(reducer(undefined,
      { type: MARKED_AS_READ_SUCCESS, payload: "data" })).
      toEqual({
        data: "data",
        error: null
      });
  });
  it("should \"MARKED_AS_READ_FAILURE\"", () => {
    expect(reducer(undefined,
      { type: MARKED_AS_READ_FAILURE, payload: "error" })).
      toEqual({
        data: false,
        error: "error"
      });
  });
  it("should \"DEFAULT\"", () => {
    expect(reducer(undefined, { type: "", payload: "" })).toEqual({
      data: false,
      error: null
    });
  });
});
