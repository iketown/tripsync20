import React, { useEffect } from "react";
import { useField } from "react-final-form";
import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";

//
//
const AddSelectedToBounds = ({ fieldName }: { fieldName: string }) => {
  const {
    input: { value }
  } = useField(fieldName);

  const { dispatch } = useMapBoxCtx();
  useEffect(() => {
    if (value && dispatch) {
      dispatch({ type: "ADD_TO_BOUNDS", payload: { locs: [value] } });
    }
  }, [value, dispatch]);
  return null;
};

export default AddSelectedToBounds;
