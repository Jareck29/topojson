using System.Collections.Generic;
using UnityEngine;

namespace NeoCourier.Managers
{
    /// <summary>
    /// Simple JSON-driven localization manager supporting Spanish and English.
    /// </summary>
    public class LocalizationManager : MonoBehaviour
    {
        public enum Language
        {
            Spanish,
            English
        }

        [System.Serializable]
        private class LocalizationEntry
        {
            public string key;
            public string value;
        }

        [System.Serializable]
        private class LocalizationData
        {
            public List<LocalizationEntry> entries;
        }

        public Language defaultLanguage = Language.Spanish;
        public string localizationFolder = "Localization";

        private readonly Dictionary<string, string> _localizedText = new Dictionary<string, string>();
        public Language CurrentLanguage { get; private set; }

        public static LocalizationManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
            LoadLanguage(defaultLanguage);
        }

        public void LoadLanguage(Language language)
        {
            CurrentLanguage = language;
            string fileName = language == Language.Spanish ? "strings_es" : "strings_en";
            _localizedText.Clear();

            string resourcePath = string.IsNullOrEmpty(localizationFolder)
                ? fileName
                : $"{localizationFolder}/{fileName}";

            TextAsset jsonAsset = Resources.Load<TextAsset>(resourcePath);
            if (jsonAsset == null)
            {
                Debug.LogError($"Localization file not found: {resourcePath}");
                return;
            }

            LocalizationData data = JsonUtility.FromJson<LocalizationData>(jsonAsset.text);
            if (data?.entries == null)
            {
                Debug.LogError($"Localization data invalid: {resourcePath}");
                return;
            }

            foreach (LocalizationEntry entry in data.entries)
            {
                if (!string.IsNullOrEmpty(entry.key))
                {
                    _localizedText[entry.key] = entry.value;
                }
            }
        }

        public string GetText(string key)
        {
            return _localizedText.TryGetValue(key, out string value) ? value : $"#{key}";
        }
    }
}
