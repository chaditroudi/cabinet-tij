export const removeUnderScore = (status:any) => {
    return status
      .split('_') // Split by underscore
      .join(' '); // Join words with space
  };
  
  export function capitalizeWords(phrase:string) {
    return phrase
      .split(' ')               // Split the phrase into words by space
      .map((word :string) => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter
      )
      .join(' ');               // Join the words back into a string
  }
  