using System.Collections;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;
using TMPro;
using NeoCourier.Managers;

namespace NeoCourier.Story
{
    /// <summary>
    /// Displays localized dialogue using typewriter effect.
    /// </summary>
    public class DialogueManager : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI dialogueText;
        [SerializeField] private Button nextButton;
        [SerializeField] private float characterDelay = 0.03f;

        public UnityEvent OnDialogueFinished;

        private Coroutine _typingRoutine;

        private void Awake()
        {
            nextButton.onClick.AddListener(ContinueDialogue);
        }

        public void ShowDialogue(string localizationKey)
        {
            if (_typingRoutine != null)
            {
                StopCoroutine(_typingRoutine);
            }

            _typingRoutine = StartCoroutine(TypeSentence(LocalizationManager.Instance.GetText(localizationKey)));
        }

        private IEnumerator TypeSentence(string sentence)
        {
            dialogueText.text = string.Empty;
            foreach (char letter in sentence)
            {
                dialogueText.text += letter;
                yield return new WaitForSeconds(characterDelay);
            }

            OnDialogueFinished?.Invoke();
        }

        private void ContinueDialogue()
        {
            OnDialogueFinished?.Invoke();
        }
    }
}
