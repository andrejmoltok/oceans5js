import { ZodType, ZodError } from "zod";

const handleOneLevelZodError = ({ issues }: ZodError<unknown>) => {
  const formData: Record<string, string> = {};

  issues.forEach(({ path, message }) => {
    formData[path.join("-")] = message;
  });

  return formData;
};

type ZObjectType = ZodType<Record<string | number, unknown>>;

type ZodParams<T extends ZObjectType> = {
  onSuccess(data: T["_output"]): void;
  onError(error: Partial<Record<keyof T["_output"], string>>): void;
  data: Record<string, unknown>;
  schema: T;
};

export type ValidationError<T extends ZObjectType> = Partial<
  Record<keyof T["_output"], string>
>;

export const handleZodValidation = <T extends ZObjectType>(
  params: ZodParams<T>
) => {
  const { data, onError, onSuccess, schema } = params;

  try {
    const res = schema.parse(data);
    onSuccess(res);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErr = handleOneLevelZodError(error);
      onError(formattedErr as Record<keyof T["_output"], string>);
    } else {
      throw new Error(String(error));
    }
  }
};
