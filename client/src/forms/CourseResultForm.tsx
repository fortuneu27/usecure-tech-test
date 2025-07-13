import { useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { CREATE_COURSE_RESULT, UPDATE_COURSE_RESULT } from "../queries/courseResults.query";
import type { CourseResult } from "../types/courseResult.type";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { GET_USER_DETAILS } from "../queries/user.query";

interface Props {
  courseResult?: CourseResult
  learnerId: string;
  finished(): void;
}
export const CourseResultForm = (props: Props) => {

  const [createCourseResult, { loading: creating, error: createError }] = useMutation(CREATE_COURSE_RESULT, {
    refetchQueries: [GET_USER_DETAILS],
    onCompleted: () => {
      props.finished();
    }
  });

  const [updateCourseResult, { loading: updating, error: updateError }] = useMutation(UPDATE_COURSE_RESULT, {
    refetchQueries: [GET_USER_DETAILS],
    onCompleted: () => {
      props.finished();
    }
  });

  useEffect(() => {
    if (createError) enqueueSnackbar(`Error creating course result: ${createError.message}`, { variant: 'error' });
  }, [createError]);
  useEffect(() => {
    if (updateError) enqueueSnackbar(`Error updating course result: ${updateError.message}`, { variant: 'error' });
  }, [updateError]);

  const formik = useFormik({
    initialValues: {
      name: props.courseResult?.name || '',
      score: props.courseResult?.score || 0,
    },
    onSubmit: (values) => {
      if (props.courseResult) {
        updateCourseResult({ variables: { id: props.courseResult.id, ...values, learnerId: props.learnerId } });
      } else {
        createCourseResult({ variables: { ...values, learnerId: props.learnerId } });
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Course Name"
          placeholder="Enter a course Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          id="score"
          name="score"
          label="Score"
          type="number"
          placeholder="Enter a score"
          value={formik.values.score}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.score && Boolean(formik.errors.score)}
          helperText={formik.touched.score && formik.errors.score}
        />
        <Button variant="contained" type="submit" disabled={creating || updating}>Submit Result</Button>
      </form>
    </div>
  );
}