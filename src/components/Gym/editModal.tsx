import { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  newExercise: { name: string; weight: number; set: string; gifUrl: string };
  handleChange: (e: { currentTarget: { name: string; value: string } }) => void;
  addEdit: (ok?: boolean) => void;
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
}[];

const EditModal: React.FC<Props> = ({ newExercise, handleChange, addEdit }) => {
  const [exerciseList, setExerciseList] = useState<ExerciseList>([]);
  const [target, setTarget] = useState("");

  const fetchExercise = useCallback(async (val: string) => {
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${val}?limit=300`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "fb968d3471mshe529dabb2be0eb6p1172a4jsna8dfbe925366",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setExerciseList(result);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (target === "") return;
    handleChange({ currentTarget: { name: "gifUrl", value: "" } });
    fetchExercise(target);
  }, [fetchExercise, target]);

  const selectExercise = (idx: string) => {
    const name = {
      currentTarget: { name: "name", value: exerciseList[parseInt(idx)].name },
    };
    handleChange(name);
    const gifUrl = {
      currentTarget: {
        name: "gifUrl",
        value: exerciseList[parseInt(idx)].gifUrl,
      },
    };
    handleChange(gifUrl);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-slate-600 bg-opacity-75 z-50 grid place-items-center`}
    >
      <Card className="w-11/12 max-w-2xl px-2 py-4">
        <CardContent className="flex flex-col gap-3">
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

          <Select onValueChange={selectExercise}>
            <SelectTrigger className="w-12/12 bg-white border-solid border border-slate-200 rounded-lg py-1">
              <SelectValue placeholder="Exercise" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="bg-white w-12/12">
                {exerciseList.map((exercise, idx) => (
                  <SelectItem key={exercise.id} value={`${idx}`}>
                    {exercise.name.charAt(0).toUpperCase() +
                      exercise.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {newExercise.gifUrl !== "" && (
            <div className="w-12/12 flex justify-center">
              <img src={newExercise.gifUrl} width={200} />
            </div>
          )}

          <Input
            placeholder="Weight"
            name="weight"
            value={newExercise.weight}
            onChange={handleChange}
            type="number"
          />
          <Input
            placeholder="Reps"
            name="set"
            value={newExercise.set}
            onChange={handleChange}
          />
          <Button onClick={() => addEdit(true)}>Ok</Button>
          <Button onClick={() => addEdit()}>Cancel</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditModal;
