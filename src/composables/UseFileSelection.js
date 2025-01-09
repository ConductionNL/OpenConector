import { useDropZone, useFileDialog } from '@vueuse/core'
import { ref, computed } from 'vue'

/**
 * File selection composable
 * @param {Array} options
 *
 * Special thanks to Github user adamreisnz for creating most of this file
 * https://github.com/adamreisnz
 * https://github.com/vueuse/vueuse/issues/4085
 *
 */
export function useFileSelection(options) {

	// Extract options
	const {
		dropzone,
		allowMultiple,
		allowedFileTypes,
		onFileDrop,
		onFileSelect,
	} = options

	// Data types computed ref
	const dataTypes = computed(() => {
		if (allowedFileTypes?.value) {
			if (!Array.isArray(allowedFileTypes.value)) {
				return [allowedFileTypes.value]
			}
			return allowedFileTypes.value
		}
		return null
	})

	// Accept string computed ref
	const accept = computed(() => {
		if (Array.isArray(dataTypes.value)) {
			return dataTypes.value.join(',')
		}
		return '*'
	})

	// Handling of files drop
	const onDrop = files => {
		if (!files || files.length === 0) {
			return
		}
		if (files instanceof FileList) {
			files = Array.from(files)
		}
		if (files.length > 1 && !allowMultiple.value) {
			files = [files[0]]
		}
		filesList.value = files
		onFileDrop && onFileDrop()
		onFileSelect && onFileSelect()
	}

	const reset = () => {
		filesList.value = null
	}

	const setFiles = (files) => {
		filesList.value = files
	}

	// Setup dropzone and file dialog composables
	const { isOverDropZone } = useDropZone(dropzone, { dataTypes, onDrop })
	const { onChange, open } = useFileDialog({
		accept: accept.value,
		multiple: allowMultiple?.value,
	})

	const filesList = ref(null)

	// Use onChange handler
	onChange(fileList => onDrop(fileList))

	// Expose interface
	return {
		isOverDropZone,
		openFileUpload: open,
		files: filesList,
		reset,
		setFiles,
	}
}
