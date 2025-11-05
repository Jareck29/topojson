using NeoCourier.Managers;
using TMPro;
using UnityEngine;

namespace NeoCourier.UI
{
    /// <summary>
    /// Simple UI toggle to switch between Spanish and English during runtime.
    /// </summary>
    public class LanguageToggleUI : MonoBehaviour
    {
        [SerializeField] private TMP_Dropdown languageDropdown;

        private void Start()
        {
            languageDropdown.ClearOptions();
            languageDropdown.AddOptions(new System.Collections.Generic.List<string>
            {
                "Español",
                "English"
            });

            languageDropdown.value = LocalizationManager.Instance.CurrentLanguage == LocalizationManager.Language.Spanish ? 0 : 1;
            languageDropdown.onValueChanged.AddListener(OnLanguageChanged);
        }

        private void OnLanguageChanged(int index)
        {
            LocalizationManager.Language language = index == 0
                ? LocalizationManager.Language.Spanish
                : LocalizationManager.Language.English;

            LocalizationManager.Instance.LoadLanguage(language);
        }
    }
}
