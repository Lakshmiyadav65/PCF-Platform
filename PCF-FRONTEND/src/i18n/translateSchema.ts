import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  QUESTIONNAIRE_SCHEMA,
  type QuestionnaireSection,
  type QuestionnaireField,
} from "../config/questionnaireSchema";

type Translate = (key: string) => string;

// Returns a copy of the field with all display strings translated. Structural
// data (name, type, option values, dependencies, etc.) is left untouched so the
// form logic, validation and stored values are unaffected.
function translateField(field: QuestionnaireField, t: Translate): QuestionnaireField {
  const out: QuestionnaireField = { ...field };

  if (field.label) out.label = t(field.label);
  if (field.placeholder) out.placeholder = t(field.placeholder);
  if (field.addButtonLabel) out.addButtonLabel = t(field.addButtonLabel);
  if (typeof field.content === "string") out.content = t(field.content);

  if (Array.isArray(field.options)) {
    // Translate the displayed label only; preserve the underlying value. Plain
    // string options become { label, value } so their stored value is kept.
    out.options = field.options.map((opt) =>
      typeof opt === "string"
        ? { label: t(opt), value: opt }
        : { ...opt, label: t(opt.label) },
    );
  }

  if (Array.isArray(field.columns)) out.columns = field.columns.map((c) => translateField(c, t));
  if (Array.isArray(field.fields)) out.fields = field.fields.map((c) => translateField(c, t));

  return out;
}

export function translateSchema(
  sections: QuestionnaireSection[],
  t: Translate,
): QuestionnaireSection[] {
  return sections.map((section) => ({
    ...section,
    title: t(section.title),
    description: section.description ? t(section.description) : section.description,
    fields: section.fields.map((field) => translateField(field, t)),
  }));
}

// Hook: the active questionnaire schema with all display text translated into
// the current language. Recomputed only when the language changes.
export function useTranslatedQuestionnaireSchema(): QuestionnaireSection[] {
  const { t, i18n } = useTranslation();
  return useMemo(
    () => translateSchema(QUESTIONNAIRE_SCHEMA, (key) => t(key)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language, t],
  );
}
