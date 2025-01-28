import Swal from 'sweetalert2';

export async function showCreateSpacePopup(): Promise<string[] | undefined> {
  const { value: formValues } = await Swal.fire({
    title: 'Create a Space',
    html: getCreateSpacePopupHtml(),
    focusConfirm: false,
    preConfirm: () => {
      return [
        (document.getElementById('swal-input1') as HTMLInputElement).value,
        (document.getElementById('swal-input2') as HTMLInputElement).value
      ];
    }
  });
  return formValues;
}

export function getCreateSpacePopupHtml(): string {
  return `
    <input id="swal-input1" class="swal2-input" placeholder="Space Name">
    <input id="swal-input2" class="swal2-input" placeholder="Capacity" type="number">
  `;
}