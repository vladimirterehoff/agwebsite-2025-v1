import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.object().shape({
    en: yup.string().required("The name (en) field is required."),
  }),
  availability: yup.mixed().required("The availability field is required."),
  vehicle_types: yup.array().of(
    yup.object().shape({
      isChecked: yup.boolean().required(),
      price: yup
        .number()
        .nullable()
        .when("isChecked", {
          is: true,
          then: yup
            .number()
            .typeError("Price must be a number")
            .required("Price is required when checked")
            .min(0, "Price must be greater than or equal to 0"),
          otherwise: yup.number().nullable(),
        }),
      time: yup
        .number()
        .nullable()
        .when("isChecked", {
          is: true,
          then: yup
            .number()
            .typeError("Time must be a number")
            .required("Time is required when checked")
            .min(0, "Time must be greater than or equal to 0"),
          otherwise: yup.number().nullable(),
        }),
    })
  ),
});
