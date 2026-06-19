import { Select } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "./index";

interface LanguageSwitcherProps {
  className?: string;
  size?: "small" | "middle" | "large";
}

// Language selector for the supplier questionnaire. Defaults to English; the
// chosen language is persisted to localStorage by i18next's LanguageDetector.
export default function LanguageSwitcher({ className, size = "middle" }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];
  const value = SUPPORTED_LANGUAGES.some((l) => l.code === current) ? current : "en";

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <GlobalOutlined className="text-gray-500" />
      <span className="text-sm text-gray-600">{t("Language")}:</span>
      <Select
        size={size}
        value={value}
        onChange={(lng) => i18n.changeLanguage(lng)}
        options={SUPPORTED_LANGUAGES.map((l) => ({ value: l.code, label: l.nativeLabel }))}
        style={{ minWidth: 140 }}
        aria-label={t("Language")}
      />
    </div>
  );
}
