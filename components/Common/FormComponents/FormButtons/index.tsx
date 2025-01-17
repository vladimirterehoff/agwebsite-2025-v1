// Libs
import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";
// Hooks
import { useConfirm } from "@/hooks/dialog/useConfirm";
// Components
import FormButtonsWrap from "./FormButtonsWrap";
import Button from "../../Button";

interface Props {
  cancelUrl: string;
}

/**
 * Form Buttons
 * @param {Props} props
 * @returns
 */
const FormButtons = (props: Props) => {
  const { cancelUrl } = props;
  const { formState } = useFormContext();
  const { push } = useRouter();

  const [cancelModal, openCancelModal] = useConfirm(
    "Warning!",
    "Are you sure you want to cancel? All unsaved fields will be deleted.",
    () => {
      push(cancelUrl);
    },
    "Yes",
    "No"
  );
  return (
    <>
      <FormButtonsWrap>
        <Button
          variant="outlined"
          color={"primary"}
          disabled={formState.isSubmitting}
          onClick={openCancelModal}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color={"primary"}
          disabled={formState.isSubmitting}
        >
          Submit
        </Button>
      </FormButtonsWrap>
      {cancelModal}
    </>
  );
};

export default FormButtons;
