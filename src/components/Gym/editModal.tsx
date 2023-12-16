"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getAuth, getIdToken } from "firebase/auth";

type Props = {
  newExercise: {
    name: string;
    weight: string;
    set: string;
    rep: string;
    gifUrl: string;
  };
  handleChange: (
    e: { currentTarget: { name: string; value: string } }[]
  ) => void;
  addEdit: (ok?: boolean) => void;
  editingIndex: number;
};

const TARGET_MUSCLE = [
  "abductors",
  "abs",
  "adductors",
  "biceps",
  "calves",
  "cardiovascular system",
  "delts",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "levator scapulae",
  "pectorals",
  "quads",
  "serratus anterior",
  "spine",
  "traps",
  "triceps",
  "upper back",
];

type ExerciseList = {
  gifUrl: string;
  name: string;
  id: number;
  instructions: string[];
}[];

const EditModal: React.FC<Props> = ({
  newExercise,
  handleChange,
  addEdit,
  editingIndex,
}) => {
  const [exerciseList, setExerciseList] = useState<ExerciseList>([]);
  const [target, setTarget] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const fetchExercise = useCallback(async (val: string) => {
    const auth = getAuth();
    if (!auth.currentUser) return;
    try {
      const token = await getIdToken(auth.currentUser);
      const url = `/api/gym/exercise?target=${val}`;
      const options = {
        method: "GET",
        headers: { token },
      };
      const response = await fetch(url, options);
      const result = await response.json();
      setExerciseList(result);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (target === "") return;
    handleChange([{ currentTarget: { name: "gifUrl", value: "" } }]);
    fetchExercise(target);
  }, [fetchExercise, target]);

  const selectExercise = (idx: string) => {
    const name = {
      currentTarget: { name: "name", value: exerciseList[parseInt(idx)].name },
    };
    const gifUrl = {
      currentTarget: {
        name: "gifUrl",
        value: exerciseList[parseInt(idx)].gifUrl,
      },
    };
    const instructions = {
      currentTarget: {
        name: "instructions",
        value: exerciseList[parseInt(idx)].instructions.join("\n"),
      },
    };

    const id = {
      currentTarget: {
        name: "id",
        value: `${exerciseList[parseInt(idx)].id}`,
      },
    };
    handleChange([name, gifUrl, instructions, id]);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-slate-600 bg-opacity-75 z-50 grid place-items-center`}
    >
      <Card className="w-11/12 max-w-2xl px-2 py-4">
        <CardContent className="flex flex-col gap-3">
          {editingIndex === -1 && (
            <>
              <Select onValueChange={setTarget}>
                <SelectTrigger className="w-12/12 bg-white border-solid border border-slate-200 rounded-lg py-1">
                  <SelectValue placeholder="Target Muscle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-white w-12/12">
                    {TARGET_MUSCLE.map((muscle) => (
                      <SelectItem key={muscle} value={muscle}>
                        {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-12/12 justify-between"
                  >
                    {value
                      ? exerciseList[parseInt(value)].name
                          .charAt(0)
                          .toUpperCase() +
                        exerciseList[parseInt(value)].name.slice(1)
                      : "Select exercise..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[75vw] max-w-xl p-0 overflow-auto max-h-96">
                  <Command
                    filter={(value, search) => {
                      if (search.length < 4) return 1;
                      const words = search.split(" ");
                      let matches = 0;
                      words.map((word) => {
                        if (
                          exerciseList[parseInt(value)]?.name
                            ?.toLowerCase()
                            .includes(word.toLowerCase())
                        )
                          matches++;
                      });

                      return matches === words.length ? 1 : 0;
                    }}
                  >
                    <CommandInput placeholder="Search exercise..." />
                    <CommandEmpty>No exercise found.</CommandEmpty>
                    <CommandGroup>
                      {exerciseList.map((exercise, idx) => (
                        <CommandItem
                          key={exercise.id}
                          value={`${idx}`}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            selectExercise(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === `${idx}` ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {exercise.name.charAt(0).toUpperCase() +
                            exercise.name.slice(1)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </>
          )}
          {newExercise.gifUrl !== "" && (
            <div className="w-12/12 flex justify-center">
              <img
                alt={newExercise.name}
                src={newExercise.gifUrl}
                className="max-w-xs w-9/12"
              />
            </div>
          )}

          <Input
            placeholder="Weight"
            name="weight"
            value={newExercise.weight}
            onChange={(e) => handleChange([e])}
            type="number"
          />
          <Input
            placeholder="Sets"
            name="set"
            value={newExercise.set}
            onChange={(e) => handleChange([e])}
          />
          <Input
            placeholder="Reps"
            name="rep"
            value={newExercise.rep}
            onChange={(e) => handleChange([e])}
          />
          <Button onClick={() => addEdit(true)}>Ok</Button>
          <Button onClick={() => addEdit()}>Cancel</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditModal;
