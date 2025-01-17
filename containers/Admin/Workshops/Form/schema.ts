import * as yup from "yup";

export const schema = yup.object().shape({
  services: yup.array().of(
    yup.object().shape({
      vehicle_types: yup.array().of(
        yup.object().shape({
          isChecked: yup.boolean().required(),
          price: yup
            .number()
            .nullable()
            .when("isChecked", {
              is: true, // Условие: поле isChecked должно быть true
              then: yup
                .number()
                .typeError("Price must be a number")
                .required("Price is required when checked")
                .min(0, "Price must be greater than or equal to 0"),
              otherwise: yup.number().nullable(), // Поле необязательно, если isChecked === false
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
    })
  ),
});
