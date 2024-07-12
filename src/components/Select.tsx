import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const Select = ({
  label,
  options,
  selected,
  onChange,
  defaultValue,
}: any) => {
  return (
    <Listbox value={selected} defaultValue={defaultValue} onChange={onChange}>
      {({ open }) => (
        <div className="min-w-[150px]">
          <Label className="block text-xs font-medium leading-6 text-gray-900">
            {label}
          </Label>
          <div className="relative mt-2">
            <ListboxButton
              className={classNames(
                "relative w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm sm:leading-6",
                open && "ring-green-500"
              )}
            >
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selected}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <ListboxOptions
              className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
              as="ul" // Ensure ListboxOptions is rendered as a ul element
            >
              {options.map((option: any) => (
                <ListboxOption
                  key={option}
                  className={({ active }) =>
                    classNames(
                      active ? "bg-green-600 text-white" : "",
                      !active && "text-gray-900",
                      "relative cursor-pointer select-none py-2 pl-3 pr-9"
                    )
                  }
                  value={option}
                  defaultValue={defaultValue}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "ml-3 block truncate"
                          )}
                        >
                          {option}
                        </span>
                      </div>

                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <CheckIcon
                            className={classNames(
                              active ? "text-white" : "text-green-600",
                              "h-5 w-5"
                            )}
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </div>
      )}
    </Listbox>
  );
};
