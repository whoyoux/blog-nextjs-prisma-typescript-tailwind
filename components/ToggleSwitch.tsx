import { Switch } from "@headlessui/react";

type SwitchType = {
  enabled: boolean;
  withText?: boolean;
  textLabel?: string;
  onClick?: () => void;
};

const ToggleSwitch = ({
  enabled = false,
  withText = false,
  textLabel = "",
  onClick = () => {},
}: SwitchType) => {
  return (
    <Switch.Group>
      <div className="w-full flex justify-between">
        <Switch.Label>{textLabel}</Switch.Label>
        <Switch
          checked={enabled}
          onChange={onClick}
          className={`${
            enabled ? "bg-blue-600" : "bg"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`transform transition ease-in-out duration-200 ${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default ToggleSwitch;
