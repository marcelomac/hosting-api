// [
//   {
//     name: 'Nomeação',
//     keyWords: [
//       ['Nomear', 'CCV-'],
//       ['Nomeação', 'CCV-'],
//     ],
//   },

//   {
//     name: 'Exoneração',
//     keyWords: [
//       ['Exonerar', 'CCV-'],
//       ['Exoneração', 'CCV-'],
//     ],
//   },

//   {
//     name: 'Início de férias',
//     keyWords: [['Conceder', 'férias']],
//   },
// ];

type MovimentType = {
  name: string;
  keyWords: string[][];
};

export function getOrdinanceType(
  ordinanceText: string,
  movimentType?: MovimentType[],
): string {
  let ordinanceType = 'Outro';

  if (movimentType) {
    let findAllWords = false;
    movimentType.forEach((type) => {
      if (findAllWords) return;

      type.keyWords.forEach((words: string[]) => {
        if (findAllWords) return;

        findAllWords = true;
        words.forEach((word) => {
          if (!ordinanceText.includes(word)) {
            findAllWords = false;
          }
        });
      });

      if (findAllWords) {
        ordinanceType = type.name;
      }
    });
  }

  return ordinanceType;
}
